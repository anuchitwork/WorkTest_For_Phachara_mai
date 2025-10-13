import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// จำนวนแบงค์ในตู้ ATM
let thousand = 20;
let fiveHundred = 20;
let hundred = 20;

// จำนวนเงินเต็มในตู ATM
const maxATM = (20 * 1000) + (20 * 500) + (20 * 100);

// ฟังก์ชันคำนวณยอดเงินรวมในตู้
function totalMoney() {
  return thousand * 1000 + fiveHundred * 500 + hundred * 100;
}

// ฟังก์ชันแสดงจำนวนแบงค์ที่เหลือ
function showBanknotes() {
  console.log(`จำนวนแบงค์ที่เหลือ: 1000=${thousand} ใบ, 500=${fiveHundred} ใบ, 100=${hundred} ใบ`);
}

// ฟังก์ชันเช็คยอดเงินต่ำกว่า 30%
function checkLowMoney() {
  if (totalMoney() < 0.3 * maxATM) {
    console.log('*** แจ้งเตือน: ยอดเงินในตู ATM ต่ำกว่า 30% ของจำนวนเต็มสูงสุด ***');
  }
}

// ฟังก์ชันถอนเงิน
function withdrawMoney(bath) {
  if (bath % 100 !== 0) {
    console.log(`${bath} บาท จำนวนเงินไม่ลงตัว กรุณาระบุใหม่`);
    return;
  }
  
  if (bath > totalMoney()) {
    console.log('ยอดเงินในตู้ ATM ไม่เพียงพอ');
    return;
  }

  let remaining = bath;

  let pay1000 = Math.min(Math.floor(remaining / 1000), thousand);
  remaining -= pay1000 * 1000;

  let pay500 = Math.min(Math.floor(remaining / 500), fiveHundred);
  remaining -= pay500 * 500;

  let pay100 = Math.min(Math.floor(remaining / 100), hundred);
  remaining -= pay100 * 100;

  if (remaining > 0) {
    console.log('ไม่สามารถแบ่งแบงค์ตามจำนวนที่ต้องการได้');
  } else {
    // ถอนเงินเรียบร้อย
    console.log(`\nถอนเงิน ${bath} บาท เรียบร้อย`);
    console.log(`เเบงค์ 1000 : ${pay1000} ใบ`);
    console.log(`เเบงค์ 500 : ${pay500} ใบ`);
    console.log(`เเบงค์ 100 : ${pay100} ใบ`);

    // ลดจำนวนแบงค์ในตู
    thousand -= pay1000;
    fiveHundred -= pay500;
    hundred -= pay100;

    console.log(`\nยอดเงินในตู้ ATM หลังถอน: ${totalMoney()} บาท`);
    showBanknotes();
    checkLowMoney();
  }
}

// ฟังก์ชันถามยอดถอนแบบวนลูป
function askWithdraw() {
  rl.question('\nระบุจำนวนเงินที่ต้องการถอน (พิมพ์ exit เพื่อออก): ', (bathInput) => {
    if (bathInput.trim().toLowerCase() === 'exit') {
      console.log('ออกจากโปรแกรม ATM');
      rl.close();
      return;
    }

    const bath = Number(bathInput.trim());
    console.log(`\nยอดเงินในตู้ ATM ก่อนถอน: ${totalMoney()} บาท`);
    checkLowMoney();
    withdrawMoney(bath);

    // เรียกตัวเองเพื่อถามใหม่
    askWithdraw();
  });
}

// เริ่มต้นโปรแกรม
askWithdraw();
