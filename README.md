## start
- npm install
- meteor

## DataHelper
1. Add a new template in the chat room :
    ```
    addAction('data-helper', {
        groups: ['channel', 'group', 'direct', 'direct_multiple', 'live', 'team'],
        id: 'data-helper',
        title: 'Data_helper',
        icon: 'user',
        template: 'DataHelper',
        order: 1,
    });
    ```
2. The new tab will show when click on the second icon.
   There are some functions such as `text_summary`,`memo`,`search`.
   relative code: `app/datahelper` 
3. And you can click on the message detail and then select `文本摘要`  
   relative code: Only add a function of `addButton` about `text_summary`, the modify locals in `app/message-star/client/actionButton.js`.
