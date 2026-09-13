import type { ReactNode } from "react";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export interface SectionControlsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onLeft: () => void;
  onRight: () => void;
  className?: string;
}

export interface BreadcrumbProps {
  subRoute?: string;
  type?: string;
  subRoute2?: string;
}

export interface SearchBarBaseProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  syncWithUrl?: boolean;
  paramName?: string;
  debounceMs?: number;
}

export interface FilterSectionProps<T = string> {
  title: string;
  items?: T[];
  selectedItems?: string[];
  initialLimit?: number;
  renderItem?: (item: T) => ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface CheckboxItemProps {
  id: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export interface RadioItemProps {
  id: string;
  value: string;
  label: string;
  className?: string;
}

