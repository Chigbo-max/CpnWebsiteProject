import {createSlice} from '@reduxjs/toolkit';

const initialState ={
    dropDown: false,
    resourcesDropDown: false,
    communityDropDown: false,
    coursesDropDown: false,
    openLink: false,
};

export const navBarSlice = createSlice({
    name: 'navBar',
    initialState,
    reducers: {
        setDropDown: (state, action) => {
            state.dropDown = action.payload;
        },
        setResourcesDropDown: (state, action) => {
            state.ResourcesDropDown =  action.payload;
        },
        setCommunityDropDown: (state, action) => {
            state.communityDropDown = action.payload;
        },
        setCoursesDropDown:(state, action)=>{
            state.coursesDropDown = action.payload;
        },
        setOpenLink: (state, action) =>{
            state.openLink = action.payload;
        }
    },
});

export const {setDropDown, setResourcesDropDown, setCommunityDropDown, setCoursesDropDown, setOpenLink} = navBarSlice.actions;
export default navBarSlice.reducer;