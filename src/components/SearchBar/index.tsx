import SearchInput from "../UI/SearchInput";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder,
}: SearchBarProps) {
  return (
    <SearchInput
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      onClear={() => onChange("")}
      placeholder={placeholder ?? "Buscar receitas..."}
      hasValue={!!value}
    />
  );
}
