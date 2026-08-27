import { useContext } from "react";
import { ServiceContext } from "./ServiceContext";

export const useService = () => useContext(ServiceContext);