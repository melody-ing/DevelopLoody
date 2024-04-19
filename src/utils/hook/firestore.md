# FireStore

- setDoc():
  用於寫入或覆蓋文件的數據。
  需要提供文件的引用,即 doc(db, "collection", "document")。
  不能直接在集合上使用 setDoc(),必須指定文件的路徑。

- addDoc():
  用於創建新文件並自動生成唯一的文件 ID。
  需要提供集合的引用,即 collection(db, "collection")。
  只能在集合上使用 addDoc(),不能在文件上使用。

- updateDoc():
  用於更新文件的部分字段。
  需要提供文件的引用,即 doc(db, "collection", "document")。
  不能直接在集合上使用 updateDoc(),必須指定文件的路徑。
