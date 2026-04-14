import { useState, useEffect, useCallback } from "react";
import { analyticsApi } from "../services/Api";

export default function useAnalytics() {
  const [summary, setSummary] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await analyticsApi.summary();
      setSummary(res.data);
    } catch {}
  }, []);

  const fetchEmotions = useCallback(async () => {
    try {
      const res = await analyticsApi.emotions();
      setEmotions(res.data);
    } catch {}
  }, []);

  const fetchMonthly = useCallback(async () => {
    try {
      const res = await analyticsApi.monthly();
      setMonthly(res.data);
    } catch {}
  }, []);

  const fetchPairs = useCallback(async () => {
    try {
      const res = await analyticsApi.pairs();
      setPairs(res.data);
    } catch {}
  }, []);

  const fetchCalendar = useCallback(async (year, month) => {
    try {
      const res = await analyticsApi.calendar(year, month);
      setCalendarData(res.data);
    } catch {}
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchSummary(), fetchEmotions(), fetchMonthly(), fetchPairs()]);
    setIsLoading(false);
  }, [fetchSummary, fetchEmotions, fetchMonthly, fetchPairs]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    summary,
    emotions,
    monthly,
    pairs,
    calendarData,
    isLoading,
    fetchSummary,
    fetchCalendar,
    fetchAll,
  };
}