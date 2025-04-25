import React from 'react';
import Dashboard from './Dashboard';
import Link from 'next/link'
import { Metadata } from 'next'
import { Header } from './components/Header'

export const metadata: Metadata = {
  title: 'BizOS - Business AI Operating System',
  description: 'Create, customize, and deploy AI agents for workflows without coding knowledge',
};

export default function HomePage() {
  return <Dashboard />;
}