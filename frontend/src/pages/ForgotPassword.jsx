import React, { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    // If you had an API like resetPassword(email):
    // const res = await resetPassword(email)
    // if (res.success) setMsg('Check your email for reset link')
    // else setMsg('Error sending reset link')
    setMsg('Demo placeholder: This would send a reset link to ' + email)
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
        <input
          type="email"
          placeholder="Enter your registered email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send Reset Link
        </button>
      </form>
      {msg && <p className="mt-4 text-green-600">{msg}</p>}
    </div>
  )
}

export default ForgotPassword
