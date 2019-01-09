const Mutations = {
    //Resolver to create Item
    async createItem(parent, args, ctx, info){
        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    },

    updateItem(parent, args, ctx, info){
        //take a copy of the input
        const updates = { ...args };
        //remove the id as it cannot be changeg
        delete updates.id;
        //Run the update
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },
    async deleteItem(parent, args, ctx, info){
        const where = {id: args.id};
        //find item
        const item = await ctx.db.query.item({ where }, `{ id title}`)
        
        return ctx.db.mutation.deleteItem({where}, info);
    }
};

module.exports = Mutations;
