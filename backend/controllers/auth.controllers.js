//............signup controller.............
export const signup= async (req,res)=>{
    res.json({
        data:"you hit the signup endpoint",
    })
}

//.......login controller......................
export const login= async (req,res)=>{
    res.json({
        data:"you hit the login endpoint",
    })
}

//.......logout controller......................
export const logout= async (req,res)=>{
    res.json({
        data:"you hit the logout endpoint",
    })
}