import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({ degree:{type:String,trim:true,default:""}, institution:{type:String,trim:true,default:""}, startDate:{type:String,trim:true,default:""}, endDate:{type:String,trim:true,default:""}, description:{type:String,trim:true,default:""} });
const experienceSchema = new mongoose.Schema({ role:{type:String,trim:true,default:""}, company:{type:String,trim:true,default:""}, startDate:{type:String,trim:true,default:""}, endDate:{type:String,trim:true,default:""}, description:{type:String,trim:true,default:""} });
const projectSchema = new mongoose.Schema({ name:{type:String,trim:true,default:""}, link:{type:String,trim:true,default:""}, description:{type:String,trim:true,default:""} });
const resumeSchema = new mongoose.Schema({
 title:{type:String,trim:true,required:true,default:"My Resume"},
 template:{type:String,enum:["professional","minimal","creative"],default:"creative"},
 accent:{type:String,default:"#C96F4A"},
 personal:{ fullName:{type:String,trim:true,default:""}, headline:{type:String,trim:true,default:""}, email:{type:String,trim:true,default:""}, phone:{type:String,trim:true,default:""}, location:{type:String,trim:true,default:""}, website:{type:String,trim:true,default:""}, summary:{type:String,trim:true,default:""} },
 skills:{type:[String],default:[]}, education:{type:[educationSchema],default:[]}, experience:{type:[experienceSchema],default:[]}, projects:{type:[projectSchema],default:[]}, certifications:{type:[String],default:[]}
},{timestamps:true});
export default mongoose.model("Resume",resumeSchema);
