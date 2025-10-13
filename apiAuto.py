#!/usr/bin/env python3
"""
spam_api_fake.py
ยิง POST requests ไปยัง endpoint ที่กำหนด โดยสร้างข้อมูลปลอมเหมือนจริง
ใช้งาน: python spam_api_fake.py --times 10 --delay 2 --url "https://..." --log out.csv
"""

import argparse
import csv
import json
import time
import uuid
import random
from datetime import datetime, timedelta

import requests
from faker import Faker
from dateutil.relativedelta import relativedelta

# ------------------ ฟังก์ชันช่วยสร้างข้อมูล ------------------
faker = Faker("th_TH")  # ใช้ locale ไทย ถ้าต้องการ locale อื่นเปลี่ยนได้

def random_birthday(min_age=18, max_age=60):
    """คืนค่า birthday ในรูป 'YYYY-MM-DD' โดยสุ่มอายุระหว่าง min_age..max_age"""
    today = datetime.today()
    age = random.randint(min_age, max_age)
    # สุ่มวันในปีของอายุนั้น
    latest = today - relativedelta(years=age)
    earliest = latest - relativedelta(years=1)
    rand_date = faker.date_between(start_date=earliest, end_date=latest)
    return rand_date.isoformat()

def random_phone_th():
    """สร้างเบอร์โทรไทยรูปแบบทั่วไป (เริ่ม 06/08/09)"""
    # Faker.th_TH.phone_number() บางครั้งได้รูปแบบไม่ตรงใจ เลยทำเอง
    prefix = random.choice(["06", "08", "09", "07"])
    # ให้มี 9-10 หลักรวม prefix -> ปกติไทยมือถือ 10 หลัก
    remaining = "".join(str(random.randint(0,9)) for _ in range(8))
    return prefix + remaining

def unique_email(firstname, lastname):
    """สร้างอีเมลที่น่าจะไม่ซ้ำโดยใช้ uuid"""
    safe_name = f"{firstname}.{lastname}".lower().replace(" ", "")
    short_uuid = uuid.uuid4().hex[:8]
    domain = random.choice(["example.com", "mail.com", "gmail.com", "hotmail.com"])
    return f"{safe_name}.{short_uuid}@{domain}"

def make_payload():
    """คืน JSON body ตามตัวอย่างของพี่ (ปรับได้)"""
    # หากต้องการแยก firstname/lastname ให้ใช้ faker.first_name() / faker.last_name()
    firstname = faker.first_name()
    lastname = faker.last_name()
    payload = {
        "email": unique_email(firstname, lastname),
        "firstname": firstname,
        "lastname": lastname,
        "birthday": random_birthday(min_age=18, max_age=60),
        "phone": random_phone_th()
    }
    return payload

# ------------------ การยิง request และบันทึก log ------------------
def send_requests(url, times=5, delay=2, headers=None, log_file=None, show_response_body=False, timeout=15):
    if headers is None:
        headers = {"accept": "*/*", "Content-Type": "application/json"}

    results = []
    for i in range(times):
        data = make_payload()
        ts = datetime.now().isoformat()
        try:
            resp = requests.post(url, json=data, headers=headers, timeout=timeout)
            status = resp.status_code
            body_text = resp.text
            ok = resp.ok
            print(f"[{i+1}/{times}] {ts} -> status {status} ok={ok} email={data['email']}")
        except Exception as e:
            status = None
            body_text = str(e)
            print(f"[{i+1}/{times}] {ts} -> ERROR: {body_text}")

        results.append({
            "timestamp": ts,
            "round": i+1,
            "status": status,
            "request_body": json.dumps(data, ensure_ascii=False),
            "response_body": body_text
        })

        # บันทึก incremental ถ้าให้ไฟล์ log
        if log_file:
            write_csv_append(log_file, results[-1])

        # delay
        if i != times - 1:
            time.sleep(delay)

    print("Done.")
    return results

def write_csv_append(path, row):
    """append row dict to csv, create header if needed"""
    header = ["timestamp", "round", "status", "request_body", "response_body"]
    write_header = False
    try:
        with open(path, "r", encoding="utf-8") as f:
            pass
    except FileNotFoundError:
        write_header = True

    with open(path, "a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        if write_header:
            writer.writeheader()
        writer.writerow(row)

# ------------------ CLI ------------------
def main():
    p = argparse.ArgumentParser(description="Send multiple POST requests with fake data.")
    p.add_argument("--url", required=False,
                   default="https://back-worktest-for-phachara-mai.onrender.com/users",
                   help="Endpoint URL")
    p.add_argument("--times", type=int, default=5, help="จำนวนรอบที่จะยิง")
    p.add_argument("--delay", type=float, default=2.0, help="Delay (วินาที) ระหว่างรอบ")
    p.add_argument("--log", default="spam_log.csv", help="ไฟล์ CSV ที่จะบันทึกผล (ถ้าไม่อยากเก็บ ให้ใส่ empty '')")
    p.add_argument("--show-body", action="store_true", help="แสดง response body ใน console")
    args = p.parse_args()

    log_file = args.log if args.log != "" else None

    print("Start sending:", args.times, "requests to", args.url)
    print("Logging to:", log_file)
    send_requests(url=args.url, times=args.times, delay=args.delay, log_file=log_file, show_response_body=args.show_body)


if __name__ == "__main__":
    main()
