import { FormInput } from "../../../components"
import { getChartOfAccounts } from "../../../helpers/chartOfAccounts"
import { useEffect, useState } from "react";

export default function ChartOfAccounts() {
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  useEffect(() => {
    const fetchChartOfAccounts = async () => {
      try {
        const data = await getChartOfAccounts();
        setChartOfAccounts(data);
      } catch (error) {
        console.error("Error fetching chart of accounts:", error);
      }
    };
    fetchChartOfAccounts();
  }, []);
  return (<>
    <h4 className="card-title mb-8">Chart of Accounts</h4>
    <div className="lg:col-span-6 col-span-12">
      <div className="card">
        <div className="p-6">
          <h4 className="card-title">List of Accounts</h4>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account No.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {chartOfAccounts.length > 0 &&
                      chartOfAccounts.map((item) => {
                        return (
                          <tr key={item.descripcion} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.account}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 ">{item.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 space-x-2">
                              <button className="text-red-500 px-4 py-2">Delete</button>
                              <button className="text-back dark:text-white px-4 py-2">Edit</button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <form className="flex gap-2">

            <FormInput
              required
              label="Account No."
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="account"
              placeholder="123456"
              className="form-input w-40"
              key="accountr"
            />
            <FormInput
              required
              label="Description"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="description"
              placeholder="Account description"
              className="form-input w-96"
              key="description"
            />

            <button type="submit" className="btn block bg-primary text-white mt-8">Add Account</button>
          </form>
        </div>
      </div>
    </div>
  </>
  )
}