var url = "https://jsonplaceholder.typicode.com/albums/2/photos";

async function fetchWithString(){
    try {
        var response = await fetch(url);
        var data = await response.json();
        var htmlString = data.reduce(function(prev, post){
            return prev + `<div class = "posts-card">
                                <img class = "post-image" src="${post.thumbnailUrl}"/>
                                <div class = "post-info">
                                    <p class = "post-title">${post.title}</p>
                                    <p class = "post-url">${post.url}</p>
                                </div>
                            </div>`
        }, "")

        document.getElementById('post-list').innerHTML= htmlString;
        let posts = document.getElementsByClassName("posts-card");
        [...posts].forEach(function(ele){
            ele.addEventListener('click', function(ev){
                var value = ev.currentTarget;
                value.style.opacity = 1;
                let timer = setInterval(function(){
                    if(value.style.opacity > 0){
                        value.style.opacity -= 0.1;
                    } else {
                        clearInterval(timer);
                        value.remove();
                    }
                }, 50);
            });
        })
    } catch (error) {
        console.log(error);
    }
}
fetchWithString();