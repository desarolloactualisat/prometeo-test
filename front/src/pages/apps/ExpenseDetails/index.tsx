import { FormInput } from "../../../components"

export default function ExpenseDetails() {
  const records = []
  const chartOfAccounts = []
  return (<>
    <h4 className="card-title mb-12">Expense Details</h4>
    <div className="card">

      <div>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Chart of Accounts</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {(records || []).map((record, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{record.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <button className="text-pink-900 hover:text-pink-700">Delete</button>
                        <button className="text-primary hover:text-sky-700">Edit</button>
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
      <form className="flex gap-2 mt-16 p-6">

        <div className='flex flex-col gap-2'>
          <label htmlFor="chart_account_id">Chart Account</label>
          <select
            required
            className='h-10 bg-transparent rounded border-gray-300 dark:border-gray-600 focus:ring-0'
            id="bank"
            name="chart_account_id"
          >
            <option disabled selected value=''> -- select an option -- </option>
            <option value=''> Anticipos </option>
            <option value=''> Gastos Generales </option>
            <option value=''> Honorarios </option>

          </select>
        </div>
        <FormInput
          required
          label="Code"
          labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
          type="text"
          name="code"
          placeholder="Expense detail code"
          className="form-input w-40"
          key="code"
        />
        <FormInput
          required
          label="Description"
          labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
          type="text"
          name="description"
          placeholder="Expense detail description"
          className="form-input w-96"
          key="description"
        />

        <div className='flex flex-col gap-2'>
          <label htmlFor="chart_account_id">Chart Account</label>
          <select
            required
            className='h-10 bg-transparent rounded border-gray-300 dark:border-gray-600 focus:ring-0'
            id="bank"
            name="chart_account_id"
          >
            <option disabled selected value=''> -- select an option -- </option>

          </select>
        </div>
        <button type="submit" className="btn block bg-primary text-white mt-8">Add expense type</button>
      </form>
    </div>
  </>
  )
}