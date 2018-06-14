#!/bin/sh
if type -p ccache >/dev/null 2>&1; then
export CCACHE_MAXSIZE=10G
export CCACHE_CPP2=true
export CCACHE_HARDLINK=true
export 
CCACHE_SLOPPINESS=file_macro,time_macros,include_file_mtime,include_file_ctime,file_stat_matches  
exec ccache /usr/bin/clang "$@"
else
exec clang++ "$@" 
fi

作者：NewPan
链接：https://juejin.im/post/5a3119066fb9a0450909821a
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
