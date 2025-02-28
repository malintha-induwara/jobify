import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

interface FilterChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

export const FilterChip = ({ label, active, onToggle }: FilterChipProps) => (
  <TouchableOpacity onPress={onToggle} className={`px-4 py-2 rounded-full mr-2 mb-2 ${active ? "bg-blue-600" : "bg-gray-100"}`}>
    <Text className={active ? "text-white" : "text-gray-700"}>
      {label
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </Text>
  </TouchableOpacity>
);
