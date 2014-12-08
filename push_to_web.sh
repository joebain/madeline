#/bin/sh

for i in index.html frame.html script/ img/ font/ mzk/ build/ maps/ lib/; do
	rsync -r -a -v -e "ssh" $i joeba.in:/var/www/joeba.in/node/public/subs/madeline/$i
done
