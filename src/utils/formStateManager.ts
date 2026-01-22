// utils/formStateManager.ts
/**
 * Utility functions for managing form state across onboarding steps
 */

// Save form data for a specific step
export const saveStepFormData = (stepKey: string, data: any): void => {
  try {
    localStorage.setItem(`formState_${stepKey}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving form data for step ${stepKey}:`, error);
  }
};

// Load form data for a specific step
export const loadStepFormData = <T>(stepKey: string, defaultValue: T): T => {
  try {
    const savedData = localStorage.getItem(`formState_${stepKey}`);
    if (savedData) {
      return JSON.parse(savedData) as T;
    }
  } catch (error) {
    console.error(`Error loading form data for step ${stepKey}:`, error);
  }
  return defaultValue;
};

// Clear all form data
export const clearAllFormData = (): void => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('formState_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('onboardingSteps');
};

// Mark a step as completed
export const markStepAsCompleted = (stepId: number): void => {
  const savedSteps = localStorage.getItem('onboardingSteps');
  if (savedSteps) {
    try {
      const steps = JSON.parse(savedSteps);
      const updatedSteps = steps.map((step: any) =>
        step.id === stepId ? { ...step, completed: true } : step
      );
      localStorage.setItem('onboardingSteps', JSON.stringify(updatedSteps));
      
      // Dispatch event for sidebar update
      const event = new CustomEvent('stepCompleted', { detail: { stepId } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error updating step completion:', error);
    }
  }
};