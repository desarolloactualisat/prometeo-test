import React, { useState, useEffect } from "react";
import { FormInput } from "../../../components";
import { axiosInstance } from "../../../helpers/api/apiCore";

const tick = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="size-6 text-green-500 h-6 w-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const cross = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="size-6 text-red-500 h-6 w-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const loadingIcon = (
  <svg
    className="animate-spin h-6 w-6 text-gray-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

export default function FacturaCG() {
  const [cuentaDeGastos, setCuentaDeGastos] = useState<
    { descripcion: string; monto: number; status: "loading" | "tick" | "cross" }[]
  >([]);

  const fetchCG = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosInstance
      .get("api/documents")
      .then((response) => {
        const data = response.data;
        // Inicializa cada elemento con el estado "loading"
        const gastosWithStatus = data.gastos.map((gasto: any) => ({
          ...gasto,
          status: "loading",
        }));
        setCuentaDeGastos(gastosWithStatus);

        // Simula la carga incremental
        gastosWithStatus.forEach((gasto: any, index: number) => {
          setTimeout(() => {
            setCuentaDeGastos((prev) =>
              prev.map((item) =>
                item.descripcion === gasto.descripcion
                  ? {
                    ...item,
                    status: Math.random() > 0.5 ? "tick" : "cross", // Asigna tick o cross aleatoriamente
                  }
                  : item
              )
            );
          }, index * 2000); // Incrementa el tiempo de carga para cada elemento
        });
      })
      .catch((error) => {
        console.error("Error fetching cuenta de gastos:", error);
      });
  };

  return (
    <div>
      <h4 className="card-title mb-12">Expense Account</h4>
      <form onSubmit={fetchCG}>
        <FormInput
          label="Visa Reference"
          labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
          type="text"
          name="visa-reference"
          placeholder="123"
          className="form-input w-40"
          key="visa-reference"
        />
        <div className="flex justify-between">
          <button type="submit" className="btn block bg-primary text-white mt-8">
            Request expenses
          </button>
          <button type="button" onClick={() => alert('Approved')} className="btn block bg-primary text-white mt-8">
            Approve expense account
          </button>
        </div>
      </form>
      <div className="card mt-8">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h4 className="card-title">
            Verified Expenses</h4>
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concept</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ammount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Receipt Found</th>
                      <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cuentaDeGastos.length > 0 &&
                         cuentaDeGastos.map((item) => {
                      return (
                        <tr key={item.descripcion} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{item.descripcion}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 ">${item.monto}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{item.status === "loading"
                  ? loadingIcon
                  : item.status === "tick"
                    ? tick
                    : cross}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                          <FormInput
                label="Approve Manually"
                labelClassName="text-gray-800 text-sm font-medium inline mb-2"
                type="checkbox"
                name="receipt"
                className="form-input w-6 h-6 inline mr-2 border-gray-400"
                key="receipt"
              />
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
      </div>
      <h5 className="card-title mt-8">
        Documento Disponibles
      </h5>
    </div>
  );
}