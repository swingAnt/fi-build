
import React, { useState } from 'react';
import styles from './index.module.scss'
import { InfoCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Tooltip, } from 'antd';
import avatar1 from '@/assets/images/avatar1.png';
import avatar from '@/assets/images/avatar.png';
import jingling from '@/assets/images/jingling.png';


const { Configuration, OpenAIApi } = require("openai");
//ai问答需要实时接口，所以使用该功能需要把mock拦截先关掉，src\index.js中注释掉 require('@/mock/index')
const configuration = new Configuration({
  apiKey: "",//chartgpt apiKey
  basePath: "https://api.openai.com/v1"
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState([]);
  const [print, setPrint] = useState(false);

  const printText = (value) => {
    const dom = document.querySelector('#print')
    const data = value.split('')
    let index = 0
    setPrint(true)
// 创建新的<img>元素节点
 const imgElement = document.createElement('img');
  // 设置<img>元素的属性，包括src属性用于指定图片的URL 
  imgElement.style.height = '24px';
  imgElement.style.width = '30px';
  imgElement.style.margin = '0px';
  imgElement.style.padding = '0px';
  imgElement.style.marginRight = '5px';
  imgElement.src = avatar; 
  // 将<img>元素添加到目标位置的DOM树中 
  dom.appendChild(imgElement);
    function writing(index) {
      if (index < data.length) {
        dom.innerHTML += data[index]
        setTimeout(writing.bind(this), 20, ++index)
      } else {
        setPrint(false)
        dom.innerHTML = ''

      }
    }
    writing(index)
  }
  // 创建一个函数，用于发送问题并获取答案
  const fetchAnswer = async () => {
    try {
      setAnswer([...answer, { type:"text","role": "user", "content": question }, {type:"loading", "role": "assistant", "content": '数据加载中' }])
      setQuestion('')
      if(question.indexOf('图片')>-1){
        const configuration = await openai.createImage({
          prompt: question,
          n: 1,
          size: "1024x1024",
        });
        console.log('configuration',configuration)
        if (configuration.status === 200) {
          const img= configuration.data.data[0].url;
          setAnswer([...answer, { type:"text","role": "user", "content": question }, { type:"img","role": "assistant", "content": img}])
        } else {
          setAnswer([...answer, {type:"text", "role": "user", "content": question }, {type:"text", "role": "assistant", "content": "抱歉，未能识别出对应的答案" }])
        }
        return
      }
      const configuration = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
                    { "role": "system", "content": "你是搞笑版周星驰，请用活泼开朗的语气回答用户的问题" },

          // { "role": "system", "content": "你是人才孵化器的AI精灵，请用活泼开朗的语气回答用户的问题" },
          ...answer.map(obj => {
            const { role,content } = obj;
            return {role,content };
          }),
          { "role": "user", "content": question }
        ]
        // 1.初始交代背景，当然也可以直接在user里面加，个人更建议在system里面加入
        // {"role": "system", "content": "你是人才孵化器的AI精灵，请用活泼开朗的语气回答用户的问题"}
        //  //2.第一轮对话，用户的问题   
        // {"role": "user", "content": "你好"},
        //  // 3.第一轮对话，chatgpt返回的答案
        // {"role": "assistant", "content": "你好！有什么我可以帮助你的吗？"},
        // 4.第二轮对话，用户的问题
        // {"role": "user", "content": question}
        ,
      });
      if (configuration.status === 200) {
        const msg = configuration.data.choices[0]["message"]["content"]
        printText(msg)
        setAnswer([...answer, { type:"text","role": "user", "content": question }, {type:"text", "role": "assistant", "content": msg }])
      } else {
        setAnswer([...answer, { type:"text","role": "user", "content": question }, { type:"text","role": "assistant", "content": "抱歉，未能识别出对应的答案" }])
      }

    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      setAnswer([...answer, { type:"text","role": "user", "content": question }, { type:"text","role": "assistant", "content": "抱歉，未能识别出对应的答案" }])
    }
  };

  // 创建一个函数，用于处理问题输入框的变化
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  // 创建一个函数，用于提交问题并获取答案
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAnswer();
  };

  return (

    <div className={styles.Box}>
      <div className={styles.answerBox}>

        <div className={styles.body}>

          {answer.map((item, index) => {
            const { content, role,type, } = item
            if (index + 1 === answer.length && print) {
              return ""
            }
            if(type==='img'){
              return <img alt='' className={styles.img} src={content}></img>
            }
            if (type === 'loading') {
              return <p className={styles.loading}>              <img alt='' className={styles.img} src={jingling}></img>
              <span  className={styles.span}>针对您的问题思考中，请耐心等待~</span></p>
            }
            return <p className={role === 'assistant' ? styles.system : styles.user}>
              <img alt='' className={styles.img} src={role === 'assistant'?avatar:avatar1}></img>
              {content}</p>
          })}
          <p id="print" className={print ? styles.system : styles.hidden}></p>

        </div>
        <form className={styles.footer} onSubmit={handleSubmit}>
          <Input
            value={question}
            className={styles.Input}
            onChange={handleQuestionChange}
            placeholder="请输入您想问的问题"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="请输入您的问题">
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0,0,0,.45)',
                  }}
                />
              </Tooltip>
            }
          />    <Tooltip title="查找">
            <Button type="primary" htmlType="submit" shape="circle" icon={<SearchOutlined />} />
          </Tooltip>
        </form>
      </div>
    </div>

  );
};

export default QAPage;

