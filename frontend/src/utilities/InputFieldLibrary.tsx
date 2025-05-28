import { Uom } from '../types/uom.ts';

interface EditableFieldProps<T> {
    value: T;
    onChange: (value: T) => void;
    className?: string;
    placeholder?: string;
}


export function EditableNumberField(props: EditableFieldProps<number>) {
    return (
        <input
            type="number"
            step="any"
            value={props.value}
            onChange={(e) => props.onChange(parseFloat(e.target.value))}
            className={props.className}
            placeholder={props.placeholder}
        />
    );
}

export function EditableTextField(props: EditableFieldProps<string>) {
    return (
        <input
            type="text"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            className={props.className}
            placeholder={props.placeholder}
        />
    );
}

interface EditableUomSelectProps {
    value: Uom;
    options: Uom[];
    onChange: (value: Uom) => void;
    className?: string;
}

export function EditableUomSelect(props: EditableUomSelectProps) {
    return (
        <select
            value={props.value.id}
            onChange={(e) => {
                const selected = props.options.find(u => u.id === parseInt(e.target.value));
                if (selected) props.onChange(selected);
            }}
            className={props.className}
        >
            {props.options.map((uom) => (
                <option key={uom.id} value={uom.id}>
                    {uom.name}
                </option>
            ))}
        </select>
    );
}


interface EditableTextareaFieldProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    rows?: number;
}

export function EditableTextareaField({
                                          value,
                                          onChange,
                                          className,
                                          placeholder,
                                          rows = 3,
                                      }: EditableTextareaFieldProps) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className}
            placeholder={placeholder}
            rows={rows}
        />
    );
}