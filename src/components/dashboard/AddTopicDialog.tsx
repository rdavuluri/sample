import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { useTopicStore } from '../../store/topicStore';
import { MODEL_CONFIGS, getModelConfig } from '../../utils/gptConfig';
import type { ModelType } from '../../types/chat';

interface AddTopicForm {
  name: string;
  model: ModelType;
}

interface AddTopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTopicDialog: React.FC<AddTopicDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { register, handleSubmit, watch, reset } = useForm<AddTopicForm>();
  const { addTopic } = useTopicStore();
  const selectedModel = watch('model') as ModelType;
  const modelConfig = selectedModel ? getModelConfig(selectedModel) : null;

  const onSubmit = (data: AddTopicForm) => {
    addTopic(data.name, data.model);
    reset();
    onClose();
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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Add New Topic
              </Dialog.Title>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Topic Name
                  </label>
                  <input
                    {...register('name', { required: true })}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Model
                  </label>
                  <select
                    {...register('model', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {Object.entries(MODEL_CONFIGS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {key} - {config.description}
                      </option>
                    ))}
                  </select>
                </div>

                {modelConfig && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Model Features
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {modelConfig.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Response Speed: {modelConfig.responseSpeed}</p>
                      <p>Category: {modelConfig.category}</p>
                      <p>
                        Cost: ${modelConfig.costPer1kTokens.toFixed(3)} per 1k
                        tokens
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Topic
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