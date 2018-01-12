window.onload = () => {
  document.querySelector('button').onclick = () => {
    const formData = new FormData()
    formData.append('uploadfile', document.querySelector('input').files[0])
    axios({
      url:'http://localhost:8080', // 此处填上服务器对应的地址（有路由把路由加上）
      method:'post',
      data:formData,
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(res => {
      console.log(res.data)
    document.querySelector('img').src = res.data.imageUrl
  })
  }

  console.log('ttttssssbbbb')
}