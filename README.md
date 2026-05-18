# SQ Framework 🚀

![Version](https://img.shields.io/badge/version-2.0-blue)

## Changelog
### 2.0.1
- Show login modal on GlobalScript.tsx
- Updated the Header.tsx to the latest version from Simple POS
- Updated the authentication behaviour on GlobalScript.tsx and Header.tsx
- Added NavSidebar.tsx component and added it as a child of Header.tsx

### 2.0
- Changed the folder structure to follow the "features" based folder structure

## How to Use

### Available Hooks

#### Theme

1. **Import the Hook**
   
   Add the following import statement to your component:
   
   ```tsx
   import { useTheme } from "../features/sq-framework/hooks/useTheme";

   const { token, fontFamily, themeName, setThemeName } = useTheme();
   // Note that "setThemeName" will change the theme name.
   // Example: setThemeName("light")
   ```

2. **Apply Theme Styles**

   Use the theme properties in your component styles:

   ```tsx
   <div
     className="mt-25 w-full h-full"
     style={{
       backgroundColor: token("page.bg"),
       fontFamily: fontFamily("inter"),
       color: token("text.primary"),
     }}
   >
   ```

#### Table (useTable)

1. **Import the Hook**

   ```tsx
   import { useTable, ColumnDef } from "../hooks/useTable";
   ```

2. **Define your columns**

    You can map a column to a field via `field`, or fully control rendering with `accessor`.

    ```tsx
    type Product = {
      id: string;
      name: string;
      sku: string;
      category: string;
      stock_amount: number;
      price: number;
      status: string;
    };

    // Define Headers:
    const columns: ColumnDef<Product>[] = [
      { id: "name", header: "Item", field: "name", sortable: true },
      { id: "sku", header: "SKU", field: "sku", sortable: true },
      { id: "category", header: "Category", field: "category", sortable: true },
      {
        id: "stock_amount",
        header: "Stock",
        sortable: true,
        accessor: (p) => (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            p.status === "Out of Stock"
              ? "bg-red-100 text-red-700"
              : p.status === "Low Stock"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-700"
          }`}>
            {p.stock_amount}
          </span>
        ),
      },
      { id: "price", header: "Price ($)", sortable: true, accessor: (p) => p.price.toFixed(2) },
      { id: "status", header: "Status", sortable: true, field: "status" },
    ];
    ```

3. **Use the hook with your data**

   ```tsx
   // Table Hook
   const {
     columns: tableColumns,
     pageRows,
     query,
     setQuery,
     sortBy,
     toggleSort,
     pageIndex,
     totalPages,
     nextPage,
     prevPage,
     canNextPage,
     canPrevPage,
     getCell,
   } = useTable<Product>({
     data: products,           // your array of Product rows
     columns,                  // the columns defined above
     pageSize: 10,             // optional (default: 10)
     initialSortBy: { id: "name", direction: "asc" },
     globalFilterKeys: ["name", "sku", "category"], // default search fields
   });
   ```

4. **Render search + table + pagination**

   ```tsx
   <div>
     {/* Search */}
     <input
       type="text"
       placeholder="Search by name, SKU, or category..."
       value={query}
       onChange={(e) => setQuery(e.target.value)}
       className="border px-3 py-2 rounded"
     />

     {/* Table */}
     <table className="min-w-full text-sm text-left">
       <thead>
         <tr>
           {tableColumns.map((col) => (
             <th
               key={col.id}
               className="px-4 py-3 font-semibold"
               onClick={() => col.sortable && toggleSort(col.id)}
             >
               <div className={`flex items-center gap-1 ${col.sortable ? "cursor-pointer select-none" : ""}`}>
                 <span>{col.header}</span>
                 {col.sortable && sortBy?.id === col.id && (
                   <span className="text-xs">{sortBy.direction === "asc" ? "▲" : "▼"}</span>
                 )}
               </div>
             </th>
           ))}
         </tr>
       </thead>
       <tbody>
         {pageRows.map((row) => (
           <tr key={row.id} className="border-b last:border-b-0">
             {tableColumns.map((col) => (
               <td key={col.id} className="px-4 py-2">
                 {getCell(row, col)}
               </td>
             ))}
           </tr>
         ))}
       </tbody>
     </table>

     {/* Pagination */}
     <div className="flex items-center gap-2 py-3">
       <button onClick={prevPage} disabled={!canPrevPage} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
       <span>Page {pageIndex + 1} of {totalPages}</span>
       <button onClick={nextPage} disabled={!canNextPage} className="px-3 py-1 bg-gray-200 rounded">Next</button>
     </div>
   </div>
   ```

5. **API Reference (quick)**

   - `ColumnDef<T>`: `{ id, header, className?, field?, accessor?, sortable? }`
   - `useTable(options)` options:
     - `data: T[]`, `columns: ColumnDef<T>[]`
     - `pageSize?: number`
     - `initialSortBy?: { id: string; direction?: "asc" | "desc" }`
     - `initialQuery?: string`
     - `filterFn?: (row: T, query: string) => boolean`
     - `globalFilterKeys?: (keyof T)[]`
   - Returns: `pageRows`, `allRows`, `query`, `setQuery`, `clearQuery`, `sortBy`, `toggleSort`, `setSort`, `pageSize`, `setPageSize`, `pageIndex`, `totalPages`, `setPageIndex`, `nextPage`, `prevPage`, `canNextPage`, `canPrevPage`, `getCell`.

---