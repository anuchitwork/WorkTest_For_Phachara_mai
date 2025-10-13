import Image from "next/image";
import FormDataUserInput from "../../components/ui/form_data_user_input";
import Table_user_data from "../../components/ui/table/table_user_data";
export default function Home() {
  return (
      <div>
        <FormDataUserInput/>
        <Table_user_data/>
      </div>
  );
}
