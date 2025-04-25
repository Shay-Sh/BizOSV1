import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges multiple class names with conditional logic using clsx and tailwind-merge.
 * This utility helps prevent duplicate tailwind classes and properly merges them.
 * 
 * @param inputs - Any number of class strings, objects, or arrays of classes
 * @returns - A merged className string
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * 
 * // With conditional classes
 * cn('text-white', isActive && 'bg-blue-500', !isActive && 'bg-gray-500')
 * 
 * // With tailwind merging
 * cn('px-2 py-1', 'p-4') // 'p-4' will override 'px-2 py-1'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 