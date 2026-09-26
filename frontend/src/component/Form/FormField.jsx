export default function FormField({ label, type = "text", name, value, onChange, required, placeholder, style }) {
    return (
      <div className="flex flex-column gap-1" style={style}>
        <label className="text-sm font-medium">{label}</label>
        <input
          className="p-2 border-1 border-round surface-border w-full"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
    );
  }