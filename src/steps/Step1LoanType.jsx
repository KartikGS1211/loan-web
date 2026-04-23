import { useForm } from "react-hook-form";
import { useFormData } from "../context/FormContext";

export default function Step1LoanType() {
  const { register, handleSubmit } = useForm();
  const { updateData } = useFormData();

  const onSubmit = (data) => {
    updateData(data);
  };

  return (
    <form onBlur={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-4">Loan Type</h2>

      <label>
        <input {...register("loanType")} type="radio" value="personal" />
        Personal
      </label>

      <label>
        <input {...register("loanType")} type="radio" value="home" />
        Home
      </label>

      <label>
        <input {...register("loanType")} type="radio" value="business" />
        Business
      </label>

      <input
        {...register("amount")}
        placeholder="Loan Amount"
        className="border p-2 w-full mt-2"
      />
    </form>
  );
}