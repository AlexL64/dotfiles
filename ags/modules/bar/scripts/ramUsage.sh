free -m | grep "Mem" | awk '{print ($3*100)/$2}'