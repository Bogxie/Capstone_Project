import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ServiceContext } from "./ServiceContext";
import { API_URL } from "./API_URL";
import { socket } from '../services/socket.js';
import axios from "axios";

const serviceKeys = {
    all: ['services'],
    config: ['services', 'config'],
    disabled: ['services', 'disabled'],
    municipalities: ['municipalities'],
    blackoutDates: ['blackoutDates'],
};

export const ServiceProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: municipalities = [], refetch: refetchMunicipalities } = useQuery({
        queryKey: serviceKeys.municipalities,
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/municipalities`);
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: serviceConfig = {}, refetch: refetchServices } = useQuery({
        queryKey: serviceKeys.config,
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/services`);
            return response.data || {};
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: disableServices = [], refetch: refetchDisabled } = useQuery({
        queryKey: serviceKeys.disabled,
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/services/disabled`);
            return response.data.disabledServices || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: blackoutDates = [], refetch: refetchBlackoutDates } = useQuery({
        queryKey: serviceKeys.blackoutDates,
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/blackout-dates`);
            return response.data.success ? response.data.data : [];
        },
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        const onServicesStatusChanged = (data) => {
            console.log('🔄 Services status changed (real-time):', data.disabledServices);
            queryClient.invalidateQueries({ queryKey: serviceKeys.disabled });
        };
        const onBlackoutDatesChanged = (data) => {
            console.log('🔄 Blackout dates changed (real-time):', data.dates);
            // ✅ ADD THIS: Update cache agad
            queryClient.setQueryData(serviceKeys.blackoutDates, data.dates);
            // ✅ Para sure, invalidate din
            queryClient.invalidateQueries({ queryKey: serviceKeys.blackoutDates });
        };

        socket.on('services-status-changed', onServicesStatusChanged);
        socket.on('blackout-dates-changed', onBlackoutDatesChanged);

        return () => {
            socket.off('services-status-changed', onServicesStatusChanged);
            socket.off('blackout-dates-changed', onBlackoutDatesChanged);
        };
    }, [queryClient]);

    // ✅ UPDATE municipalities
    const updateMunicipalitiesMutation = useMutation({
        mutationFn: async (updateData) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/municipalities`,
                updateData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(serviceKeys.municipalities, data);
            queryClient.invalidateQueries({ queryKey: serviceKeys.municipalities });
        },
        onError: (err) => {
            console.error('Error updating municipalities:', err);
        },
    });

    // ✅ UPDATE services config
    const updateServicesMutation = useMutation({
        mutationFn: async (updateData) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/services`,
                updateData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(serviceKeys.config, data);
            queryClient.invalidateQueries({ queryKey: serviceKeys.config });
        },
        onError: (err) => {
            console.error('Error updating services:', err);
        },
    });

    // ✅ UPDATE disabled services
    const updateDisabledMutation = useMutation({
        mutationFn: async (disabledServices) => {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/services/disabled`,
                { disabledServices },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(serviceKeys.disabled, data.disabledServices);
            queryClient.invalidateQueries({ queryKey: serviceKeys.disabled });
            socket.emit('services-status-changed', { disabledServices: data.disabledServices });
        },
        onError: (err) => {
            console.error('Error updating disabled services:', err);
        },
    });

    const updateBlackoutDatesMutation = useMutation({
        mutationFn: async (dates) => {
            const token = localStorage.getItem('token');

            const normalizedDates = [...new Set(dates)]
                .filter(Boolean)
                .sort();

            console.log(
                '📤 Sending blackout dates to API:',
                normalizedDates
            );

            const response = await axios.put(
                `${API_URL}/blackout-dates`,
                { dates: normalizedDates },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                '📥 Blackout dates API response:',
                response.data
            );

            if (!response.data.success) {
                throw new Error('Update failed');
            }

            return response.data.data;
        },
        onSuccess: (data) => {
            const normalizedDates = [...new Set(data)].sort();

            queryClient.setQueryData(
                serviceKeys.blackoutDates,
                normalizedDates
            );

            console.log(
                '✅ Blackout dates cache updated:',
                normalizedDates
            );
        },
        onError: (err) => {
            console.error('Error updating blackout dates:', err);
        },
    });
    // ✅ FIXED: Proper refresh functions na bumabalik ng data
    const refreshMunicipalities = async () => {
        const result = await refetchMunicipalities();
        return result.data;
    };

    const refreshServices = async () => {
        const result = await refetchServices();
        return result.data;
    };

    const refreshDisabled = async () => {
        const result = await refetchDisabled();
        return result.data;
    };

    const refreshBlackoutDates = async () => {
        const result = await refetchBlackoutDates();
        return result.data;
    };

    const updateMunicipalities = updateMunicipalitiesMutation.mutateAsync;
    const updateServices = updateServicesMutation.mutateAsync;
    const updateDisable = updateDisabledMutation.mutateAsync;
    const updateBlackoutDates = updateBlackoutDatesMutation.mutateAsync;

    return (
        <ServiceContext.Provider value={{
            municipalities,
            serviceConfig,
            disableServices,
            blackoutDates,
            refreshMunicipalities,
            refreshServices,
            refreshDisabled,
            refreshBlackoutDates,
            updateMunicipalities,
            updateServices,
            updateDisable,
            updateBlackoutDates,
        }}>
            {children}
        </ServiceContext.Provider>
    );
};