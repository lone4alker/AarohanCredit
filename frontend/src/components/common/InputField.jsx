import React from 'react';

const InputField = ({
    label,
    icon: Icon,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-2.5 text-gray-400" size={18} />}
                <input
                    type={type}
                    name={name}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder={placeholder}
                    {...props}
                />
            </div>
        </div>
    );
};

export default InputField;
