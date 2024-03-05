import { createSlice } from '@reduxjs/toolkit';
import { useParams } from 'react-router-dom';

const initialState = {
    data: null,
    loading: null,
    error: false,

}

export const Sneakers = createSlice({
    name: 'Sneakers',
    initialState,
    /*
    c'est ici que les réduceurs sont définis.
    les réduceurs sont des fonctions qui décrivent comment l'état de l'application change en réponse à des actions.
    */
    reducers: {
        FETCH_START: (draft) => {
            draft.loading = true;
        },
        FETCH_SUCCESS: (draft, action) => {
            draft.loading = false
            draft.data = action.payload
        },
        FETCH_FAILLURE: (draft) => {
            draft.loading = false
            draft.error = true
        },
        FETCH_DATA: (draft, action) => {
            draft.loading = false
            draft.data = action.payload
        },

    }
})
export const { FETCH_START, FETCH_SUCCESS, FETCH_FAILLURE, FETCH_DATA } = Sneakers.actions

export default Sneakers.reducer;