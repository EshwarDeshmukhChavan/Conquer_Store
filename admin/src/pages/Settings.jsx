import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const schema = yup.object({
  storeName: yup.string().required('Store name is required'),
  storeEmail: yup.string().email('Invalid email').required('Store email is required'),
  storePhone: yup.string().required('Store phone is required'),
  storeAddress: yup.string().required('Store address is required'),
  currency: yup.string().required('Currency is required'),
  taxRate: yup.number().min(0).max(100).required('Tax rate is required'),
}).required();

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      reset(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await axios.put('/api/settings', data);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Store Settings</h3>
            <p className="mt-1 text-sm text-gray-600">
              Update your store information and preferences.
            </p>
          </div>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                    Store Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="storeName"
                      {...register('storeName')}
                      className="input-field"
                    />
                    {errors.storeName && (
                      <p className="mt-2 text-sm text-red-600">{errors.storeName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                    Store Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="storeEmail"
                      {...register('storeEmail')}
                      className="input-field"
                    />
                    {errors.storeEmail && (
                      <p className="mt-2 text-sm text-red-600">{errors.storeEmail.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">
                    Store Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="storePhone"
                      {...register('storePhone')}
                      className="input-field"
                    />
                    {errors.storePhone && (
                      <p className="mt-2 text-sm text-red-600">{errors.storePhone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                    Store Address
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="storeAddress"
                      rows={3}
                      {...register('storeAddress')}
                      className="input-field"
                    />
                    {errors.storeAddress && (
                      <p className="mt-2 text-sm text-red-600">{errors.storeAddress.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <div className="mt-1">
                    <select
                      id="currency"
                      {...register('currency')}
                      className="input-field"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                    {errors.currency && (
                      <p className="mt-2 text-sm text-red-600">{errors.currency.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                    Tax Rate (%)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="taxRate"
                      step="0.01"
                      {...register('taxRate')}
                      className="input-field"
                    />
                    {errors.taxRate && (
                      <p className="mt-2 text-sm text-red-600">{errors.taxRate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 