using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RateMyCollegeClub.Data;
using RateMyCollegeClub.Interfaces;
using RateMyCollegeClub.Models;
using RateMyCollegeClub.Models.Categories;

namespace RateMyCollegeClub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly ICategoriesRepository _categoriesRepository;

    public CategoriesController(IMapper mapper, ICategoriesRepository categoriesRepository)
    {
        _mapper = mapper;
        _categoriesRepository = categoriesRepository;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GetCategoriesDTO>>> GetCategories()
    {   
        var categories = await _categoriesRepository.GetAllAsync();
        var categoriesDTO = _mapper.Map<List<GetCategoriesDTO>>(categories);
        return Ok(categoriesDTO);
    }

    // GET: api/categories/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<GetCategoryDTO>> GetCategory(int id)
    {
        var category = await _categoriesRepository.GetIndividualCategoryDetails(id);

        if (category is null)
        {
            return NotFound();
        }

        var categoryDTO = _mapper.Map<GetCategoryDTO>(category);
        
        return Ok(categoryDTO);
    }

    // POST: api/categories
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateCategoryDTO>> CreateCategory(CreateCategoryDTO createCategoryDTO)
    {
        var category = _mapper.Map<Category>(createCategoryDTO);

        await _categoriesRepository.AddAsync(category);
        
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    // PUT: api/categories/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDTO updateCategoryDTO)
    {
        var category = await _categoriesRepository.GetAsync(id);
        
        if(category is null){
            return NotFound();
        }

        _mapper.Map(updateCategoryDTO, category);

        try
        {
            await _categoriesRepository.UpdateAsync(category);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CategoryExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/categories/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _categoriesRepository.GetAsync(id);
        if (category is null)
        {
            return NotFound();
        }

        await _categoriesRepository.DeleteAsync(id);

        return NoContent();
    }

    private async Task<bool> CategoryExists(int id)
    {
        return await _categoriesRepository.Exists(id);
    }
}
