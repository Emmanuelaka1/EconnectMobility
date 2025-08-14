export default function UserAvatar({ name, url, size=32 }:{name?:string; url?:string|null; size?:number}) {
  const style = { width: size, height: size };
  if (url) return (<img src={url} alt={name ?? "Avatar"} className="rounded-full object-cover ring-2 ring-white/10" style={style} />);
  return ( <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />);
}
