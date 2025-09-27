import { columns, Payment } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 20,
      status: 'pending',
      email: 'm@example.com'
    },
    {
      id: '728ed52f',
      amount: 10,
      status: 'success',
      email: 'cm@example.com'
    },
    {
      id: '728ed52f',
      amount: 500,
      status: 'pending',
      email: 'dm@example.com'
    },
    {
      id: '728ed52f',
      amount: 10050,
      status: 'pending',
      email: 'am@example.com'
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'success',
      email: 'm@example.com'
    }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className='container mx-auto max-w-4xl py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
