import React from "react";
import { useReducer } from "react";

export default function useUpdateGallery() {
  const ACTIONS = {
    CHANGE_GALLERY_NAME: "CHANGE_GALLERY_NAME",
    CHANGE_COLOR_TONE: "CHANGE_COLOR_TONE",
    CHANGE_ROOM_TYPE: "CHANGE_ROOM_TYPE",
    CHANGE_CONTENT: "CHANGE_CONTENT",
    CHANGE_IMAGE: "CHANGE_IMAGE",
    CHANGE_PRODUCT_LIST: "CHANGE_PRODUCT_LIST",
  };

  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.CHANGE_GALLERY_NAME:
        return { ...state, gallery_name: action.next };
      case ACTIONS.CHANGE_COLOR_TONE:
        return { ...state, color_tone: action.next };
      case ACTIONS.CHANGE_CONTENT:
        return { ...state, content: action.next };
      case ACTIONS.CHANGE_IMAGE:
        return { ...state, image: action.next };
      case ACTIONS.CHANGE_ROOM_TYPE:
        return { ...state, room_type: action.next };
      case ACTIONS.CHANGE_PRODUCT_LIST:
        return { ...state, product_list: action.next };
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    gallery_name: "",
    color_tone: "",
    room_type: "",
    content: "",
    image: [],
    product_list: [],
  });

  return [state, dispatch, ACTIONS];
}
