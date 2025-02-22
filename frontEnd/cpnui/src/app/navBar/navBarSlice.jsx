import {createSlice} from '@reduxjs/toolkit';

const initialState ={
    dropDown: false,
    knowledgeHubDropDown: false,
    communityDropDown: false,
    openLink: false,
};

export const navBarSlice = createSlice({
    name: 'navBar',
    initialState,
    reducers: {
        setDropDown: (state, action) => {
            state.dropDown = action.payload;
        },
        setKnowledgeHubDropDown: (state, action) => {
            state.knowledgeHubDropDown =  action.payload;
        },
        setCommunityDropDown: (state, action) => {
            state.communityDropDown = action.payload;
        },
        setOpenLink: (state, action) =>{
            state.openLink = action.payload;
        }
    },
});

export const {setDropDown, setKnowledgeHubDropDown, setCommunityDropDown, setOpenLink} = navBarSlice.actions;
export default navBarSlice.reducer;