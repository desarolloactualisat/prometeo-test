import { FormInput } from "../../../components"
import { useState } from "react"

export default function ExpenseTypes() {
  const [records, setRecords] = useState<any[]>([])
  return (<>
    <h4 className="card-title mb-12">Expense types</h4>
    <div className="card">
      <div>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense Types</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(records || []).map((record, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{record}</td>
                     
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <div className="flex gap-2">
                          <button className="text-pink-900 hover:text-pink-700 px-4 py-2">Delete</button>
                          <button className="text-primary hover:text-sky-700 px-4 py-2">Edit</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <form className="flex gap-2 mt-12 p-6" onSubmit={(e) => {
        e.preventDefault()
        const expenseType = (e.target as any).elements['expense-type'].value;
        setRecords((prevRecords) => [...prevRecords, expenseType]);
        (e.target as any).reset()
      }}>

            <FormInput
              required
              label="Expense Type"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="expense-type"
              placeholder="Anticipos"
              className="form-input w-40"
              key="expense-type"
            />
            <button type="submit" className="btn block bg-primary text-white mt-8">Add expense type</button>
          </form>
    </div>
  </>
  )
}