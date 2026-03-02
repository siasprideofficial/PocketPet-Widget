import { useEffect, useCallback } from 'react';
import { PetMood, PetStyle } from '../types/pet';

interface WidgetMessage {
  type: string;
  payload: any;
}

/**
 * Hook for bridging communication between React app and native Android widget
 */
export function useWidgetBridge(
  onWidgetTap?: () => void,
  onWidgetRequest?: (requestType: string) => void
) {
  useEffect(() => {
    // Listen for messages from native widget
    const handleWidgetMessage = (event: MessageEvent) => {
      try {
        const message: WidgetMessage = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;

        switch (message.type) {
          case 'WIDGET_TAP':
            onWidgetTap?.();
            break;
          case 'WIDGET_REQUEST':
            onWidgetRequest?.(message.payload?.requestType);
            break;
          default:
            console.log('Unknown widget message:', message.type);
        }
      } catch (error) {
        // Not a widget message, ignore
      }
    };

    window.addEventListener('message', handleWidgetMessage);
    
    // Also listen for Capacitor custom events
    document.addEventListener('widgetTap', () => onWidgetTap?.());

    return () => {
      window.removeEventListener('message', handleWidgetMessage);
      document.removeEventListener('widgetTap', () => onWidgetTap?.());
    };
  }, [onWidgetTap, onWidgetRequest]);

  // Send state update to widget
  const updateWidget = useCallback((mood: PetMood, style: PetStyle) => {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins?.PocketPetWidget?.updateWidget({
          mood,
          style,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.log('Widget update not available');
      }
    }
  }, []);

  // Force widget refresh
  const refreshWidget = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      try {
        (window as any).Capacitor.Plugins?.PocketPetWidget?.refreshWidget();
      } catch (error) {
        console.log('Widget refresh not available');
      }
    }
  }, []);

  return {
    updateWidget,
    refreshWidget,
  };
}
