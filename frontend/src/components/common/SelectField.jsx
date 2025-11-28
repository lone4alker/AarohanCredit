import React from 'react';

const SelectField = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    className = '',
    placeholder,
    ...props
}) => {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value || option} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
