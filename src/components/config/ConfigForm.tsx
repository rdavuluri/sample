import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GPTConfig, GPTConfigSchema, configStore } from '../../utils/gptConfig';
import { toast } from 'sonner';

interface ConfigFormProps {
  isOpen: boolean;
  configName: string | null;
  onClose: () => void;
}

type ConfigFormData = z.infer<typeof GPTConfigSchema> & { name: string };

export const ConfigForm: React.FC<ConfigFormProps> = ({
  isOpen,
  configName,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfigFormData>();

  React.useEffect(() => {
    if (configName) {
      const config = configStore.getCustomConfig(configName);
      if (config) {
        reset({ ...config, name: configName });
      }
    } else {
      reset({
        name: '',
        modelId: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        description: '',
        contextWindow: 8192,
        costPer1kTokens: 0.03,
        features: [],
        capabilities: {},
        category: 'custom',
        responseSpeed: 'balanced',
      });
    }
  }, [configName, reset]);

  const onSubmit = async (data: ConfigFormData) => {
    try {
      const { name, ...configData } = data;
      if (configName) {
        configStore.updateCustomConfig(configName, configData);
        toast.success('Configuration updated successfully');
      } else {
        configStore.addCustomConfig(name, configData);
        toast.success('Configuration added successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save configuration');
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {configName ? 'Edit Configuration' : 'Add New Configuration'}
              </Dialog.Title>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      {...register('name', { required: true })}
                      type="text"
                      disabled={!!configName}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">Name is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Model ID
                    </label>
                    <input
                      {...register('modelId', { required: true })}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Temperature
                    </label>
                    <input
                      {...register('temperature', {
                        required: true,
                        min: 0,
                        max: 2,
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Max Tokens
                    </label>
                    <input
                      {...register('maxTokens', {
                        required: true,
                        min: 1,
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register('category')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="premium">Premium</option>
                      <option value="standard">Standard</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Response Speed
                    </label>
                    <select
                      {...register('responseSpeed')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="fast">Fast</option>
                      <option value="balanced">Balanced</option>
                      <option value="thorough">Thorough</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    {configName ? 'Update' : 'Add'} Configuration
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};