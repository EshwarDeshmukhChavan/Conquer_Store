import React, { useState } from 'react'
import { addOrg, setDiscount } from '../api/adminApi'

const AdminPanel = () => {
  const [org, setOrg] = useState({ name: '', domain: '', allowedCategories: '' })
  const [discountForm, setDiscountForm] = useState({ orgId: '', productId: '', discountPercent: 0 })

  const handleAddOrg = async () => {
    await addOrg({
      ...org,
      allowedCategories: org.allowedCategories.split(',').map(s => s.trim())
    })
    alert('Org added')
  }

  const handleSetDiscount = async () => {
    await setDiscount(discountForm)
    alert('Discount set')
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-6">
        <h2 className="font-semibold">Add Organization</h2>
        <input
          type="text"
          placeholder="Org Name"
          value={org.name}
          onChange={(e) => setOrg({ ...org, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Domain"
          value={org.domain}
          onChange={(e) => setOrg({ ...org, domain: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={org.allowedCategories}
          onChange={(e) => setOrg({ ...org, allowedCategories: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleAddOrg} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Organization
        </button>
      </div>

      <div>
        <h2 className="font-semibold">Set Discount</h2>
        <input
          type="text"
          placeholder="Org ID"
          value={discountForm.orgId}
          onChange={(e) => setDiscountForm({ ...discountForm, orgId: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Product ID"
          value={discountForm.productId}
          onChange={(e) => setDiscountForm({ ...discountForm, productId: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discountForm.discountPercent}
          onChange={(e) => setDiscountForm({ ...discountForm, discountPercent: parseFloat(e.target.value) })}
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleSetDiscount} className="bg-green-600 text-white px-4 py-2 rounded">
          Set Discount
        </button>
      </div>
    </div>
  )
}

export default AdminPanel
