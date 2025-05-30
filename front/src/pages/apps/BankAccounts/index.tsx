import React, { useState, useEffect } from 'react';
import { getBankAccounts, deleteBankAccount, createBankAccount, updateBankAccount } from '../../../helpers/bankAccounts';
import { getChartOfAccounts } from '../../../helpers/chartOfAccounts';
import { ModalLayout } from '../../../components/HeadlessUI'


interface SimpleModalProps {
  isModalOpen: boolean;
  handleModal: () => void;
  confirmDelete: () => Promise<void>;
}

interface InputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  name: string;
}

const Input: React.FC<InputProps> = ({ id, value, onChange, label, name }) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id}>{label}</label>
      <input required type="text" id={id} value={value} onChange={onChange} name={name} className='bg-transparent rounded border-gray-300 dark:border-gray-600 focus:ring-0' />
    </div>
  );
};


const SimpleModal: React.FC<SimpleModalProps> = ({ isModalOpen, handleModal, confirmDelete }) => {

  return (
    <div>
      <ModalLayout
        showModal={isModalOpen}
        toggleModal={handleModal}
        panelClassName="sm:max-w-lg"
        placement="justify-center items-start"
      >
        <div className="duration-500  ease-out transition-all sm:w-full m-3 sm:mx-auto flex flex-col bg-white border shadow-sm rounded-md dark:bg-slate-800 dark:border-gray-700">
          <div
            className="flex justify-between items-center py-2.5 px-4 border-b dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-white text-lg">
              Confirm Delete
            </h3>
            <button className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 dark:text-gray-200">
              <span className="material-symbols-rounded" onClick={handleModal}>close</span>
            </button>
          </div>
          <div className="px-4 py-8 overflow-y-auto">
            <p className="text-gray-800 dark:text-gray-200">
              This action cannot be undone. Are you sure you want to delete this bank account?
            </p>
          </div>
          <div
            className="flex justify-end items-center gap-4 p-4 border-t dark:border-slate-700">
            <button
              className="btn dark:text-gray-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:dark:bg-slate-700 transition-all"
              onClick={handleModal} type="button">Cancel</button>
            <button className="btn bg-red-500 text-white" onClick={() => confirmDelete()}>Confirm Delete</button>
          </div>
        </div>
      </ModalLayout>
    </div>
  )
}

export default function BankAccounts() {

  interface BankAccount {
    bank: string;
    account_number: string;
    currency: string;
    id?: string;
    chart_account_id: string;
  }

  interface ChartOfAccount {
    account: string;
    description: string;
    id: string;
  }

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<string>();
  const [mode, setMode] = useState<'Edit' | 'Add'>('Add');
  const [formData, setFormData] = useState({
    bank: '',
    account_number: '',
    currency: '',
    chart_account_id: ''
  });


  const updateFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await getBankAccounts();
        setBankAccounts(response);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    const fetchChartOfAccounts = async () => {
      try {
        const response = await getChartOfAccounts();
        setChartOfAccounts(response);
      } catch (error) {
        console.error("Error fetching chart of accounts:", error);
      }
    };
    if (chartOfAccounts.length === 0) fetchChartOfAccounts();
    if (bankAccounts.length === 0) fetchBankAccounts();
  }, [])

  const delBankAccount = async () => {
    try {
      const status = await deleteBankAccount(idToDelete!);
      if (status !== 200) {
        console.error("Error deleting bank account:", status);
        return;
      }
      const updatedAccounts = bankAccounts.filter(account => account.id !== idToDelete);
      setBankAccounts(updatedAccounts);
    }
    catch (error) {
      console.error("Error deleting bank account:", error);
    }
  }

  const createBakAcc = async (e:any) => {
    e.preventDefault();
    try {
      const response = await createBankAccount(formData);
      setBankAccounts((prev) => [...prev, {...formData, id: response.id}]);
      setFormData({
        bank: '',
        account_number: '',
        currency: '',
        chart_account_id: ''
      });
    } catch (error) {
      console.error("Error creating bank account:", error);
    }
  }
  const editBankAccount = async (e:any) => {
    e.preventDefault()
    try {
      const response = await updateBankAccount(idToDelete!, formData);
      console.log(response)
     
      const updatedAccounts = bankAccounts.map(account => {
        if (account.id === idToDelete) {
          return {
            ...account,
            ...formData
          }
        }
        return account;
      })
      setFormData({
        bank: '',
        account_number: '',
        currency: '',
        chart_account_id: ''
      });
      setBankAccounts(updatedAccounts);
      setMode('Add');
      setIdToDelete(undefined);
    } catch (error) {
      console.error("Error updating bank account:", error);
    }
  }

  return (<>
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h4 className="card-title">Cuentas Bancarias</h4>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bankAccounts.length > 0 && bankAccounts.map((record, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{record.bank}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.account_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{record.currency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <div className='flex gap-4 justify-end'>
                            <button className="text-pink-900 hover:text-pink-700" onClick={() => {
                              setIdToDelete(record.id);
                              setIsModalOpen(true);
                            }} >Delete</button>
                            <button className="text-primary hover:text-sky-700" onClick={() => {
                              setFormData({
                                bank: record.bank,
                                account_number: record.account_number,
                                currency: record.currency,
                                chart_account_id: record.chart_account_id
                              });
                              setMode('Edit');
                              setIdToDelete(record.id);
                            }}  >Edit</button>
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
      <form className='mt-8 p-4' onSubmit={mode=== 'Add' ? createBakAcc : editBankAccount}>
        <h4 className="card-title mb-4">{mode} Bank Account</h4>
        <div className="flex gap-2 flex-wrap">
          <Input
            label='Bank'
            id="bank"
            name="bank"
            value={formData.bank}
            onChange={updateFormData}
          />
          <Input
            label='Account Number'
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={updateFormData}
          />
          <Input
            label='Curency'
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={updateFormData}
          />
          <div className='flex flex-col gap-2'>
            <label htmlFor="chart_account_id">Chart Account</label>
          <select
          required
              className='h-10 bg-transparent rounded border-gray-300 dark:border-gray-600 focus:ring-0'
              id="bank"
              name="chart_account_id"
              value={formData.chart_account_id}
              onChange={updateFormData}
            >
              <option disabled value=''> -- select an option -- </option>
              {chartOfAccounts.map((account, idx) => {
                return (
                  <option key={idx} value={account.id}>{account.account} - {account.description}</option>
                )
              }
              )}
            </select>
          </div>
          <button className="btn block bg-primary text-white mt-8">{mode} Bank Account</button>
        </div>
      </form>
      <SimpleModal isModalOpen={isModalOpen} handleModal={() => setIsModalOpen(!isModalOpen)} confirmDelete={async () => {
        await delBankAccount();
        setIsModalOpen(false);
      }} />
    </div>
  </>
  )
}


