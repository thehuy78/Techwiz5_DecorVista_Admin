import React from "react";
import { useReducer } from "react";
import brandOptions from "../data/optionsBrand";
import optionsFunction from "../data/optionsFunction";
import variantOptions from "../data/variantOptions";

export default function useCreateProductReducer() {
  const ACTIONS = {
    CHANGE_NAME: "CHANGE_NAME",
    CHANGE_DESCRIPTION: "CHANGE_DESCRIPTION",
    CHANGE_IMAGES: "CHANGE_IMAGES",
    CHANGE_VARIANTS: "CHANGE_VARIANTS",
    CHANGE_ACTIVE: "CHANGE_ACTIVE",
    CHANGE_VARIANT_DETAIL: "CHANGE_VARIANT_DETAIL",
    CHANGE_FUNCTION: "CHANGE_FUNCTION",
    CHANGE_ROOM_TYPE: "CHANGE_ROOM_TYPE",
    CHANGE_COLOR: "CHANGE_COLOR",
  };

  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.CHANGE_NAME:
        return { ...state, productName: action.next };
      case ACTIONS.CHANGE_DESCRIPTION:
        return { ...state, description: action.next };
      case ACTIONS.CHANGE_IMAGES:
        return { ...state, images: action.next };
      case ACTIONS.CHANGE_VARIANTS:
        return { ...state, variants: action.next };
      case ACTIONS.CHANGE_ACTIVE:
        return { ...state, active: action.next };
      case ACTIONS.CHANGE_VARIANT_DETAIL:
        return { ...state, variant_detail: action.next };
      case ACTIONS.CHANGE_BRAND:
        return { ...state, brand: action.next };
      case ACTIONS.CHANGE_FUNCTION:
        return { ...state, roomFuncion: action.next };
      case ACTIONS.CHANGE_COLOR:
        return { ...state, colors: action.next };
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    productName: "",
    brand: brandOptions[0],
    roomFuncion: optionsFunction[0],
    description: "",
    images: [],
    variants: [variantOptions[0]],
    variant_detail: [],
    active: true,
    colors: [],
  });

  return [state, dispatch, ACTIONS];
}
