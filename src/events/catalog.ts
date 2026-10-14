import data from '../data/events.json';
import { validateEvents } from './validation';
import type { EventRecord } from './types';

export const EVENTS: readonly EventRecord[] = validateEvents(data);
export const getPublishedEvents = (events: readonly EventRecord[] = EVENTS): EventRecord[] => events.filter(event => event.published);
