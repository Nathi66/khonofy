import type * as React from "react";

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  position?: "item-aligned" | "popper";
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export const Select: React.ComponentType<SelectProps>;
export const SelectGroup: React.ComponentType<{ children?: React.ReactNode }>;
export const SelectValue: React.ComponentType<SelectValueProps>;
export const SelectTrigger: React.ForwardRefExoticComponent<
  SelectTriggerProps & React.RefAttributes<HTMLButtonElement>
>;
export const SelectContent: React.ForwardRefExoticComponent<
  SelectContentProps & React.RefAttributes<HTMLDivElement>
>;
export const SelectLabel: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
export const SelectItem: React.ForwardRefExoticComponent<
  SelectItemProps & React.RefAttributes<HTMLDivElement>
>;
export const SelectSeparator: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
export const SelectScrollUpButton: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
export const SelectScrollDownButton: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
