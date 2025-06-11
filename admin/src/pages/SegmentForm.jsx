import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const SegmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      allowedRoles: [],
      allowedCategories: [],
      organizations: [],
      discountPercentage: 0,
      isActive: true
    }
  });

  const roles = ['user', 'admin', 'epp', 'spp', 'sepp'];
  const watchAllowedRoles = watch('allowedRoles', []);
  const watchAllowedCategories = watch('allowedCategories', []);
  const watchOrganizations = watch('organizations', []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('/api/organizations');
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast.error('Failed to load organizations');
      }
    };

    fetchCategories();
    fetchOrganizations();

    if (isEditMode) {
      fetchSegment();
    }
  }, [isEditMode, id]);

  const fetchSegment = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/segments/${id}`);
      const segment = response.data;
      
      // Set form values
      setValue('name', segment.name);
      setValue('description', segment.description);
      setValue('allowedRoles', segment.allowedRoles || []);
      setValue('allowedCategories', segment.allowedCategories?.map(cat => cat._id) || []);
      setValue('organizations', segment.organizations?.map(org => org._id) || []);
      setValue('discountPercentage', segment.discountPercentage || 0);
      setValue('isActive', segment.isActive);
    } catch (error) {
      console.error('Error fetching segment:', error);
      toast.error('Failed to load segment details');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`/api/segments/${id}`, data);
        toast.success('Segment updated successfully');
      } else {
        await axios.post('/api/segments', data);
        toast.success('Segment created successfully');
      }
      navigate('/segments');
    } catch (error) {
      console.error('Error saving segment:', error);
      toast.error(error.response?.data?.message || 'Failed to save segment');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role) => {
    const currentRoles = [...watchAllowedRoles];
    if (currentRoles.includes(role)) {
      setValue('allowedRoles', currentRoles.filter(r => r !== role));
    } else {
      setValue('allowedRoles', [...currentRoles, role]);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const currentCategories = [...watchAllowedCategories];
    if (currentCategories.includes(categoryId)) {
      setValue('allowedCategories', currentCategories.filter(id => id !== categoryId));
    } else {
      setValue('allowedCategories', [...currentCategories, categoryId]);
    }
  };

  const handleOrganizationToggle = (orgId) => {
    const currentOrgs = [...watchOrganizations];
    if (currentOrgs.includes(orgId)) {
      setValue('organizations', currentOrgs.filter(id => id !== orgId));
    } else {
      setValue('organizations', [...currentOrgs, orgId]);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Segment' : 'Create New Segment'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {isEditMode 
              ? 'Update the details of an existing segment' 
              : 'Create a new segment to group users and apply specific rules'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Name */}
          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={3}
                {...register('description', { required: 'Description is required' })}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Discount Percentage */}
          <div className="sm:col-span-2">
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
              Discount Percentage
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="discountPercentage"
                min="0"
                max="100"
                step="0.01"
                {...register('discountPercentage', { 
                  min: { value: 0, message: 'Discount cannot be negative' },
                  max: { value: 100, message: 'Discount cannot exceed 100%' },
                  valueAsNumber: true
                })}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              {errors.discountPercentage && (
                <p className="mt-1 text-sm text-red-600">{errors.discountPercentage.message}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="sm:col-span-2">
            <div className="flex items-center h-full pt-5">
              <input
                id="isActive"
                type="checkbox"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Allowed Roles */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Roles
            </label>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    id={`role-${role}`}
                    type="checkbox"
                    checked={watchAllowedRoles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`role-${role}`} className="ml-2 block text-sm text-gray-700 capitalize">
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Allowed Categories */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <input
                    id={`category-${category._id}`}
                    type="checkbox"
                    checked={watchAllowedCategories.includes(category._id)}
                    onChange={() => handleCategoryToggle(category._id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`category-${category._id}`} className="ml-2 block text-sm text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organizations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {organizations.map((org) => (
                <div key={org._id} className="flex items-center">
                  <input
                    id={`org-${org._id}`}
                    type="checkbox"
                    checked={watchOrganizations.includes(org._id)}
                    onChange={() => handleOrganizationToggle(org._id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`org-${org._id}`} className="ml-2 block text-sm text-gray-700">
                    {org.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button
            type="button"
            onClick={() => navigate('/segments')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SegmentForm;