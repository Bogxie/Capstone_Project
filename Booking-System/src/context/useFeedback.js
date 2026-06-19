import { useContext } from 'react';
import { FeedbackContext } from './FeedbackContext';

export const useFeedback = () => useContext(FeedbackContext);