import { FormInput } from "../../../components";

export default function PurchaseOrder() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h4 className="card-title">Purchase Order Recording</h4>
        </div>
      </div>
      <div className="p-6">
        <form className="">
          <div className="flex gap-2 ">
            <FormInput
              label="No.Po"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="text"
              placeholder="123456"
              className="form-input w-40"
              key="po-number"
            />
            <FormInput
              label="Description"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="description"
              placeholder="product"
              className="form-input w-60"
              key="description"
            />
            <FormInput
              label="SKU"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="sku"
              placeholder="SKU"
              className="form-input w-28"
              key="sku"
              />
            <FormInput
              label="Weight"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="weight"
              placeholder="10000"
              className="form-input w-28"
              key="weight"
              />
            <FormInput
              label="NO.Fo"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="fo"
              placeholder="123"
              className="form-input w-28"
              key="fo"
              />
            <FormInput
              label="Date"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="date"
              name="date"
              placeholder="123"
              className="form-input w-40"
              key="date"
              />
            </div>
            <span>PREGUNTAR: ¿cómo se relacionará con la Financial Operation? esto en caso de que se registre antes</span>
          <button type="submit" className="btn block bg-primary text-white mt-8">Submit</button>
        </form>
      </div>
    </div>
  );
}