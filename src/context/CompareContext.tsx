import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompareContextType {
  compareList: string[]; // List of product IDs
  isInCompare: (productId: string) => boolean;
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('aurum_compare');
    if (cached) {
      try {
        setCompareList(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse cached compare list');
      }
    }
  }, []);

  const saveToLocal = (items: string[]) => {
    setCompareList(items);
    localStorage.setItem('aurum_compare', JSON.stringify(items));
  };

  const isInCompare = (productId: string) => {
    return compareList.includes(productId);
  };

  const addToCompare = (productId: string): boolean => {
    if (compareList.includes(productId)) return true;
    
    // Increased capacity limit to 4 products matching requests
    if (compareList.length >= 4) {
      alert("You can compare a maximum of 4 items at a time. Please remove an item first.");
      return false;
    }

    const updated = [...compareList, productId];
    saveToLocal(updated);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter(id => id !== productId);
    saveToLocal(updated);
  };

  const clearCompare = () => {
    saveToLocal([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, isInCompare, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
};
