import {useState, useRef, useEffect} from 'react'
import * as faceAPi from 'face-api.js';


const FaceDetection = () => {

    const [isDisplay, setIsDisplay]=useState(false);
    const [isPlaying, setIsPlaying]=useState(false);
    const [angry, setAngry] = useState(0);
    const [happy, setHappy] = useState(0);
    const [orderedEmotions, setOrderedEmotions]=useState('');
    const videoRef = useRef({})
  


 
    useEffect(()=>{
        Promise.all([
        faceAPi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceAPi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceAPi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceAPi.nets.faceExpressionNet.loadFromUri('/models')
        
    ]).then(
        
        getVideo
    ).catch((err)=>{
        console.log(err)
    })},[])
    
    
    
    const getVideo =()=> {
        navigator.mediaDevices.getUserMedia({
            video: {
                
            }
        }).then((stream)=>{
            let video = videoRef.current
            video.srcObject = stream;
            setIsPlaying(true);
    })
    }

    if(isPlaying){
        setInterval(async ()=>{
            const detections = await faceAPi.detectSingleFace(videoRef.current, new faceAPi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            setAngry(detections?.expressions.angry);
            setHappy(detections?.expressions.happy);
            const sortedArray = detections?.expressions.asSortedArray();
            if(!sortedArray=== undefined){
                setOrderedEmotions(sortedArray[0].expression);
            }
            
            
        },5000)
    }

    
   

    
  return (
    <div className="container">
        <button onClick={()=>{setIsDisplay(true)}}>enable video</button>
        <button onClick={()=>{setIsDisplay(false)}}>disable video</button>
        <video ref={videoRef} id="video" autoPlay muted className={isDisplay? '' : 'hidden'}></video>
        <div className="emotions">
            <p>{orderedEmotions}</p>
            <p className="happy"> happy :{happy}</p>
            <p className="angry"> angry: {angry}</p>
            
        </div>
    </div>
  )
}

export default FaceDetection